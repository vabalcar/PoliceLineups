class Singleton(type):
    instances = {}

    def __call__(cls, *args, **kwargs):
        instance_description = (cls, *args, *kwargs.values())
        if instance_description not in cls.instances:
            cls.instances[instance_description] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls.instances[instance_description]