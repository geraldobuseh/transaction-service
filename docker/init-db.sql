IF DB_ID(N'$(DB_NAME)') IS NULL
BEGIN
    DECLARE @sql nvarchar(max) = N'CREATE DATABASE ' + QUOTENAME(N'$(DB_NAME)');
    EXEC(@sql);
END
GO
