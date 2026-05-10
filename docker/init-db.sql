IF DB_ID('transactionsdb') IS NULL
BEGIN
    CREATE DATABASE transactionsdb;
END
GO