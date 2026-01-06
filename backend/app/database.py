# backend/database.py
import os

# Your SQL Connection String
# (Make sure to use Driver 17 if 18 fails, as discussed before)
CONN_STR = "Driver={ODBC Driver 18 for SQL Server};Server=tcp:databasetrudrape.database.windows.net,1433;Database=databasetrudrape;Uid=trudrapedb;Pwd=db@123456;Encrypt=yes;TrustServerCertificate=yes;Connection Timeout=30;"

def get_conn_str():
    return CONN_STR
