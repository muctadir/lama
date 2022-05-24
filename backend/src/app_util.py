import re

class AppUtil():
    @staticmethod
    def check_args(required, args):
        """
        @param required : a list of arguments needed for the backend method
        @param args : a dictionary of arguments supplied from the frontend
        @return : True <=> all required arguments supplied /\ no extra arguments supplied
        """
        if all(arg in args for arg in required): # All arguments supplied
            # Check no extra arguments supplied
            for key in args.keys():
                if key not in required:
                    return False
            return True
        return False
    
    @staticmethod
    def check_email(email):
        """
        @param email: a string
        @return : True <==> email is a validly formatted email
        Note: Does not check if email actually exists
        Note: Whilst the input field on the frontend can check this, users can edit html
            so the backend should also check formatting
        See: https://www.rfc-editor.org/rfc/rfc3696#section-3
        See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#validation
            Note: this pattern does not work here
        """
        return True
    
    @staticmethod
    def check_username(username):
        """
        @param username : a string
        @return : True <=> username is valid
        A valid username is defined as a username that:
            has no leading or trailing whitespace
            is at least 5 characters long
            is no more than 32 characters long (database constraint)
        """
        return len(username.strip()) == len(username) and \
                len(username) >= 4 and \
                len(username) <= 32 # max username length according to db
    
    @staticmethod
    def check_password(password):
        """
        @param username : a string
        @return : True <=> password is valid and complex
        A valid password is defined as a password that:
            has no leading or trailing whitespace
            is no more than 64 characters long (database constraint)
        A complex password is defined as a password that:
            is not in the list of banned common passwords (or similar to them)
            is at least 8 characters long
            fulfills at least one of the following requirements:
                contains an uppercase and lowercase character
                contains a special and non-special character
                contains a number and non-number character
                
                NB: we say at least one because enforcing many constraints actually makes passwords more predictable
        """
        banned = ["password", "password123"] # A list of common banned passwords (use env. variable?)
        caseRe = r"(?=.*[a-z]).*[A-Z]" # Uppercase and lowercase
        specialRe = r"(?=.*\W).*[\w]" # Special and non-special (note: underscore is non-special)
        numberRe = r"(?=.*[0-9]).*[^0-9]" # Number and non-number
        valid = len(password) <= 64 and len(password) == len(password.strip())
        complex = len(password) >= 8 and \
                password.lower() not in banned and \
                (re.match(caseRe, password) or \
                re.match(specialRe, password) or \
                re.match(numberRe, password))
        return valid and complex
    
    @staticmethod
    def get_all_subclasses(cls):
        """
        @param cls : class to get subclasses of
        @return all subclasses of cls, including non-immediate subclasses
        Note: If you only need immediate subclasses then use cls.__subclasses__()
        """
        all_subclasses = set()

        for subclass in cls.__subclasses__():
            all_subclasses.add(subclass)
            all_subclasses.update(AppUtil.get_all_subclasses(subclass))
        
        return all_subclasses