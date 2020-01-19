DROP PROCEDURE IF EXISTS ExportTable;
DROP PROCEDURE IF EXISTS ExportDB;
DELIMITER $$
CREATE PROCEDURE ExportTable(
        IN tableName VARCHAR(255),
        IN delim VARCHAR(255),
        IN path VARCHAR(255)) BEGIN

    DECLARE columnName VARCHAR(255);

    DECLARE curColumns CURSOR FOR
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = @db
        AND table_name = tableName
        ORDER BY ordinal_position;

    DECLARE CONTINUE HANDLER FOR NOT FOUND
        SET @done = TRUE;

    SET @db = DATABASE();
    SET @done = FALSE;
    SET @firstLine = TRUE;
    SET @header = '';

    OPEN curColumns;

    columns_loop: LOOP
        FETCH curColumns INTO columnName;
        IF @done THEN
            LEAVE columns_loop;
        END IF;
        IF @firstLine THEN
            SET @header = CONCAT("'", columnName, "'");
            SET @firstLine = FALSE;
            ITERATE columns_loop;
        END IF;
        SET @header = CONCAT(@header, ", '", columnName, "'");
    END LOOP;

    CLOSE curColumns;

    SET @exportData = CONCAT(
        '(SELECT ', @header ,") 
        UNION ALL
        (SELECT * 
        FROM `", tableName ,"`)
        INTO OUTFILE '", path, "'
        CHARACTER SET 'utf8mb4'
        FIELDS TERMINATED BY '", delim, "'
        LINES TERMINATED BY '\r\n'"
    );

    PREPARE exportData FROM @exportData;
    EXECUTE exportData;
    DEALLOCATE PREPARE exportData;
END $$

CREATE PROCEDURE ExportDB(
    IN delim VARCHAR(255),
    IN pathDelim VARCHAR(255),
    IN path VARCHAR(255)) BEGIN

    DECLARE tableName VARCHAR(255);

    DECLARE curTables CURSOR FOR 
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = @db;

    DECLARE CONTINUE HANDLER FOR NOT FOUND
        SET @done = TRUE;

    SET @db = DATABASE();
    SET @pathDelim = PATH_DELIMITER();
    SET @pathDelim = CONCAT(@pathDelim, @pathDelim);
    SET @done = FALSE;

    OPEN curTables;

    tables_loop: LOOP
        FETCH curTables INTO tableName;
        IF @done THEN
            LEAVE tables_loop;
        END IF;
        SET @outPath = CONCAT(path, @pathDelim, tableName, '.csv');
        CALL ExportTable(tableName, delim, @outPath);
    END LOOP;

    CLOSE curTables;

END $$
DELIMITER ;