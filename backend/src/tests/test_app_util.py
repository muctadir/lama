from src.app_util import *

def test_check_args_missing():

    args = {
        'p_id': 1
    }
    required = ('p_id', 'u_id')

    result = check_args(required, args)

    assert not result

def test_check_args_extra():

    args = {
        'p_id': 1,
        'u_id': 1
    }
    required = ('p_id')

    result = check_args(required, args)

    assert not result

def test_check_args_mixed():

    args = {
        'p_id': 1
    }
    required = ('u_id')

    result = check_args(required, args)
    
    assert not result

def test_check_args_correct():

    args = {
        'p_id': 1,
        'u_id': 1
    }
    required = ('p_id', 'u_id')

    result = check_args(required, args)
    
    assert result