"""
Author: Eduardo Costa Martins
This package contains all the models. This specific file also initialises schemas for all models.
Schemas can be accessed via the `__marshmallow__` attribute of a model.
Note: This is the Schema _class_, so you need to instantiate the schema still (e.g. `schema = Item.__marshmallow__()`)
"""

from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import ModelConversionError
from inspect import getmembers, isclass, ismodule
from sys import modules
from sqlalchemy import event
from sqlalchemy.orm import mapper
from marshmallow import fields, post_dump

db = SQLAlchemy()
ma = Marshmallow()

def __setup_schemas():

    # Get each module in this package
    for _, module in getmembers(modules[__name__], ismodule):

        # Get each (statically declared) model in each module
        # `getmembers` can have predicate to filter out certain members (this is the lambda expression)
        # In this case the predicate checks that the member:
        #   is a class
        #   has a __tablename__ attribute, a check to see if the class is a model (easier than checking inheritance)
        #   the member belongs to the module (to remove duplicates, since imported classes also count as a member)
        for name, model in getmembers(module, lambda member:
                isclass(member) and hasattr(member, '__tablename__') and member.__module__ == module.__name__):

            # Make sure the class is not a schema
            if name.endswith("Schema"):
                raise ModelConversionError(
                    "For safety, setup_schemas can not be used when a"
                    "Model class ends with 'Schema'"
                )

            # See if the item has a changelog associated with it
            change_cls = getattr(model, "__change__", None)
            
            if change_cls:
                # Create schema for the changelog
                change_schema = __create_change_schema(change_cls)
                # Link schema to the changelog class
                setattr(change_cls, "__marshmallow__", change_schema)

            schema = None

            # Create schema for each model
            match name:
                case "User":
                    schema = __create_user_schema()
                case "Label":
                    schema = __create_label_schema()
                case _:
                    schema = __create_auto_schema(model)
            # Link schema to the model class
            setattr(model, "__marshmallow__", schema)

def __create_user_schema():
    # Import inside the function (otherwise circular import)
    from src.models.auth_models import User, UserStatus

    class UserSchema(ma.SQLAlchemyAutoSchema):
        def __init__(self, *args, **kwargs):
            # Exclude the password row when serializing a user
            super(UserSchema, self).__init__(exclude=['password'], *args, **kwargs)

        class Meta:
            # The meta class contains options for the schema
            # The model we are serializing
            model = User
            # Include foreign keys
            include_fk = True
            # `load_instance = False` is default, we do not allow loading users from a json
            # since the password would not be provided

        # Enum fields are not automatically serialized/deserialized
        status = fields.Method("get_approval", deserialize="load_approval")

        # The functions below describe how to serialize/deserialize enums
        def get_approval(self, obj):
            return obj.status.name

        def load_approval(self, value):
            return UserStatus[value]

    return UserSchema

def __create_label_schema():
    # Import inside the function (otherwise circular import)
    from src.models.item_models import Label

    class LabelSchema(ma.SQLAlchemyAutoSchema):

        class Meta:
            # The meta class contains options for the schema
            # The model we are (de)serializing
            model = Label
            # Include foreign keys
            include_fk = True
            # Allow using this schema to deserialise a json into a transient entity
            # NB: Transient refers to an entity not in the database, do not use this to fetch existing entities
            load_instance = True

        # The frontend Label class requires the label type name to be constructed
        # So sometimes we add the type attribute to label objects
        # Since it's not a default attribute, it's not automatically serialized so we add a new field
        type = fields.Method("get_type")

        # Gets the type name, and defaults to None if it does not exist
        def get_type(self, obj):
            return getattr(obj, 'type', None)

        # This will remove the type attribute if it is None
        @post_dump
        def remove_none_type(self, data, **kwargs):
            if not data['type']:
                del data['type']
            return data
    
    return LabelSchema

def __create_change_schema(cls):

    from src.models.change_models import ChangeType

    # We define the attributes of the schema
    # Every schema has a meta class
    class Meta:
        # The meta class contains options for the schema
        # The model we are (de)serialising
        model = cls
        # Include foreign keys
        include_fk = True
        # Allow using this schema to deserialise a json into a transient entity
        # NB: Transient refers to an entity not in the database, do not use this to fetch existing entities
        load_instance = True

    # Marshmallow does not automatically convert to/from enums
    # We link the attribute to functions that describe how to do so
    change_type = fields.Method(
        "get_approval", deserialize="load_approval")

    # The functions below describe how to serialize/deserialize enums
    def get_approval(self, obj):
        return obj.change_type.name

    def load_approval(self, value):
        return ChangeType[value]

    # Class name is Item Name + Change + Schema
    schema_class_name = '%sSchema' % cls.__name__

    # type function returns a class object
    schema_class = type(
        # Name of class
        schema_class_name,
        # Inherited classes
        (ma.SQLAlchemyAutoSchema, ),
        # Dictionary of attributes
        {
            'change_type': change_type,
            'get_approval': get_approval,
            'load_approval': load_approval,
            'Meta': Meta
        })

    return schema_class

def __create_auto_schema(cls):
    
    class Meta(object):
        # The meta class contains options for the schema
        # The model we are (de)serialising
        model = cls
        # Include foreign keys
        include_fk = True
        # Allow using this schema to deserialise a json into a transient entity
        # NB: Transient refers to an entity not in the database, do not use this to fetch existing entities
        load_instance = True
    
    # Add Schema to the end of the class name
    schema_class_name = "%sSchema" % cls.__name__

    # type function returns a class object
    schema_class = type(
        # Name of the class
        schema_class_name, 
        # Inherited classes
        (ma.SQLAlchemyAutoSchema, ), 
        # Dictionary of attributes
        {
            'Meta': Meta
        }
    )

    return schema_class

# Wait for the mapper to finish configuring the ORM models, then setup the schemas
event.listen(mapper, 'after_configured', __setup_schemas)

# List of modules of this package
# Alternatively you can also just import the modules instead
__all__ = ['auth_models', 'change_models', 'item_models', 'project_models']