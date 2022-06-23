from pathlib import Path
from pprint import PrettyPrinter

def insert(prepend, line):
    return (prepend + line[:-2]+ ';\n').replace("\\'", "''")

p = Path(__file__).with_name('lama_test.sql')
with p.open('r') as file:
    test = file.readlines()

prepend = ''
new_file = []

for line in test:
    new_line = ''
    if prepend != '':
        if line.endswith(',\n'):
            new_line = insert(prepend, line)
        elif line.endswith(';\n'):
            new_line = insert(prepend, line)
            prepend = ''
    if line.startswith('INSERT INTO') and '`alembic_version`' not in line:
        prepend = line.strip('VALUES\n') + 'VALUES '

    new_file.append(new_line)

if not test[-1]:
    test = test[:-1]

# pp = PrettyPrinter()
# pp.pprint(new_file)

with p.open('w') as file:
    file.writelines(new_file)
