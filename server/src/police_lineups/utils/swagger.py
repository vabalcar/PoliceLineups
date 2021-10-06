from swagger_server.models.base_model_ import Model


def clear_model_update(swagger_model: Model) -> dict:
    return {k: v for k, v in swagger_model.to_dict().items() if v is not None}
