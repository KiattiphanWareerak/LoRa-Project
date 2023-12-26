import os

# List files in the root directory
file_list = os.listdir()
print("Files in the root directory:")
for file_name in file_list:
    print(file_name)
