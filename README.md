# LocalLibraryApp

This app makes use of MongoDB for its database. This app does the basic CRUD operations.

## Create Operations

Authors can be added to the database by using the "Create author" link on the left menu.

Genre's can be added to the database by using the "Create genre" link on the left menu.

In order to create a new book, the genre's that the book uses and the author must already exist within the database. If the book introduces a new genre, it
must first be created with the "Create new genre" link. The author of the book must also exist within the database before the books creation, if they don't exist, 
then they must be created.

The book-instances are the available copies of the book in the library. A book-instance can't exist without already existing book. There can't be an instance of a book, 
if the book doesn't exist.

## Update Operations

Update operations doesn't have any restrictions

## Delete Operations

In order to delete Genre's and Author's from the database, all associated books with those genre's and author's must be deleted first. To delete a book, all book-instances 
(available copies) must be deleted from the database.

