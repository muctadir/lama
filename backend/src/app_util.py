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