from pathlib import Path
from sys import argv

def __insert(prepend, line):
    return (prepend + line[:-2]+ ';\n').replace("\\'", "''")

def convert_file(name, out):
    # Add .sql extension if it does not exist
    if name[:-4] != '.sql':
        name += '.sql'
    if out[:-4] != '.sql':
        out += '.sql'

    # Open file with that name
    p = Path(__file__).with_name(name)

    try:
        with p.open('r') as file:
            data = file.readlines()
    except OSError:
        print("File does not exist")
        return
    
    try:
        # Try creating the files
        f = open(out, 'x')
        f.close()
    except FileExistsError:
        # If it exists, ask for permission to overwrite
        overwrite = input("File already exists, do you wish to overwrite? (Y/N)")

        while overwrite.upper() != 'Y' and overwrite.upper() != 'N':
            overwrite = input("File already exists, do you wish to overwrite? (Y/N)")
        
        if overwrite.upper() == 'N':
            return
    
    # To store new data
    new_file = []
    # Used to add INSERT INTO (..., ...) VALUES
    # before the start of each line with an insert
    prepend = ''

    # Convert line by line
    for line in data:
        new_line = ''
        # If the line follows an insert statement
        if prepend != '':
            # Convert that insertion to a new statement
            if line.endswith(',\n'):
                new_line = __insert(prepend, line)
            # If it was the last insertion, then we also need to clear prepend to signify to start clearing lines again
            elif line.endswith(';\n'):
                new_line = __insert(prepend, line)
                prepend = ''
        # Signify we if we need to begin inserting into a table that is not alembic_version
        if line.startswith('INSERT INTO') and '`alembic_version`' not in line:
            prepend = line.strip('VALUES\n') + 'VALUES '
        # Store line
        new_file.append(new_line)

    # Clear any empty lines at the end
    while not new_file[-1]:
        new_file.pop()
    # Remove line break
    if new_file[-1][-1] == '\n':
        new_file[-1] = new_file[-1][:-1]

    # Path to output file
    p = Path(__file__).with_name(out)

    # Write file
    with p.open('w') as file:
        file.writelines(new_file)

if __name__ == '__main__':

    # We need 2 arguments, but the first one is always the file we are running
    if len(argv) != 3:
        print("Incorrect number of arguments")
        print(str(argv))
    else:
        convert_file(argv[1], argv[2])