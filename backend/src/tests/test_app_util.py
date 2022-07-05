from src.app_util import check_args, check_email, check_username, check_password, check_string, check_whitespaces


def test_check_args():
    """
    Tests for checking if the check_args function works
    """
    # Check when not all args given
    args = {'p_id': 1}
    required = ['p_id', 'u_id']
    assert check_args(required, args) == False

    # Check when moreargs given
    args = {'p_id': 1, 'u_id': 1}
    required = ['p_id']
    assert check_args(required, args) == False

    # Check when wrong args given
    args = {'p_id': 1}
    required = ['u_id']
    assert check_args(required, args) == False

    # Check when correct args given
    args = {'p_id': 1, 'u_id': 1}
    required = ('p_id', 'u_id')
    assert check_args(required, args) == True


def test_check_email():
    """
    Tests for checking if the check_email function works
    """
    assert check_email("") == False
    assert check_email("t") == False
    assert check_email("@") == False
    assert check_email(".") == False
    assert check_email("@.") == False
    assert check_email("@.com") == False
    assert check_email("test@.com") == False
    assert check_email("@test.com") == False
    assert check_email("test@.") == False
    assert check_email("@test.") == False
    assert check_email("t@t.t") == False
    assert check_email("t@t.com") == True
    assert check_email("test@test.com") == True


def test_check_username():
    """
    Tests for checking if the check_username function works
    """
    assert check_username("") == False
    assert check_username("ed") == False
    assert check_username(
        "eddieveerlevictheajarlanabartjanchinnolinh") == False
    assert check_username("ed   ") == False
    assert check_username("   ed") == False
    assert check_username("Veerle") == True


def test_check_password():
    """
    Tests for checking if the check_username function works
    """
    assert check_password("") == False
    assert check_password("password") == False
    assert check_password("test") == False
    assert check_password("Password") == False
    assert check_password("TESTUSER123") == True


def test_check_string():
    """
    Tests for checking if the check_string function works
    """
    assert check_string(["/"]) == False
    assert check_string([";"]) == True
    assert check_string(["\\"]) == True
    assert check_string(["#"]) == True
    assert check_string([","]) == True
    assert check_string(["Hello\\"]) == True
    assert check_string(["Hello;"]) == True
    assert check_string(["Hello#"]) == True
    assert check_string(["Hello,"]) == True
    assert check_string(["Hello"]) == False


def test_check_whitespaces():
    """
    Tests for checking if the check_whitespaces function works
    """
    assert check_whitespaces(["Hello   "]) == True
    assert check_whitespaces(["    Hello"]) == True
    assert check_whitespaces(["    Hello   "]) == True
    assert check_whitespaces(["Hello"]) == False
