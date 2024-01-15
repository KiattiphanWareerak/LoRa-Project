import psycopg2

# Replace these with your own database connection details
db_config = {
    'host': '192.168.50.54',
    'database': 'chirpstack_login',
    'user': 'postgres',
    'password': 'postgres',
    'port': '5432',
}

def fetch_data_from_login_table():
    connection = None  # Initialize connection outside the try block

    try:
        # Establish a connection to the PostgreSQL database
        connection = psycopg2.connect(**db_config)

        # Create a cursor object to interact with the database
        cursor = connection.cursor()

        # Define your SQL query to select data from the "login" table
        query = "SELECT * FROM login;"

        # Execute the query
        cursor.execute(query)

        # Fetch all the rows from the result set
        rows = cursor.fetchall()

        # Display the fetched data
        for row in rows:
            print(row)

    except (Exception, psycopg2.Error) as error:
        print("Error fetching data from PostgreSQL:", error)

    finally:
        # Close the database connection and cursor in the finally block
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed.")

# Call the function to fetch data from the "login" table
fetch_data_from_login_table()