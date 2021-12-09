class Singleton(type):
    classes_to_instances = {}

    def __call__(cls, *instance_args):
        if cls not in cls.classes_to_instances:
            cls.classes_to_instances[cls] = {}

        instances = cls.classes_to_instances[cls]

        if instance_args not in instances:
            instances[instance_args] = super(
                Singleton, cls).__call__(
                *instance_args)

        return instances[instance_args]
