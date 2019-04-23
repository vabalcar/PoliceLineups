DROP PROCEDURE IF EXISTS ExportTable;
DELIMITER $$
CREATE PROCEDURE ExportTable(
        IN tableName VARCHAR(255),
        IN delim VARCHAR(255),
        IN pathHeader VARCHAR(255),
        IN pathData VARCHAR(255)) BEGIN

    SET @outFilesConfig = CONCAT(
        "CHARACTER SET 'utf8mb4' ",
        "FIELDS TERMINATED BY '", delim, "' ",
        "LINES TERMINATED BY '\\r\\n'"
    );

    SET @exportHeader = CONCAT(
        "SELECT column_name ",
        "FROM information_schema.columns ",
        "WHERE table_schema = ? ",
        "AND table_name = ? ",
        "ORDER BY ordinal_position ",
        "INTO OUTFILE '", pathHeader, "' ",
        @outFilesConfig
    );

    SET @db = DATABASE();
    SET @tableName = tableName;
    PREPARE exportHeader FROM @exportHeader;
    EXECUTE exportHeader USING @db, @tableName;
    DEALLOCATE PREPARE exportHeader;

    SET @exportData = CONCAT(
        "SELECT * ",
        "FROM `", tableName ,"` ",
        "INTO OUTFILE '", pathData, "' ",
        @outFilesConfig
    );    

    PREPARE exportData FROM @exportData;
    EXECUTE exportData;
    DEALLOCATE PREPARE exportData;
END $$
DELIMITER ;