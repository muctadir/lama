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
        TODO: Should return True <=> the email supplied is a valid email
        See: https://www.rfc-editor.org/rfc/rfc3696#section-3
        Note: This can get super complex so don't worry about it too much
        """
        return True
    
    @staticmethod
    def check_username(username):
        """
        TODO: Should return True <=> in correct format
        """
        return True
    
    @staticmethod
    def check_password(password):
        """
        TODO: Should return True <=> fulfills password complexity requirements
        """
        return True