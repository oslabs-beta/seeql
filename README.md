# SeeQL [beta]

Welcome to SeeQL: An easy-to-use desktop application that helps you visualize your database tables and quickly generate complex joins. All foreign and primary key relationshps are clear and visible.

## Getting Started

---

#### Requirements

You'll need a Postgres database to connect to.

#### How to Install

Beta Release 0.0.1

MacOS: [seeql-0.0.1.dmg](https://github.com/oslabs-beta/seeql/releases/download/0.0.1/seeql-0.0.1.dmg)

Or from the terminal, run:

```
git clone https://github.com/oslabs-beta/seeql.git
cd seeql
yarn
yarn run build
yarn start

```

## Features and how to get started:

---

**Logging In**

Log-in to your database to view all your tables. You have the option to log in with a `postgres://` URI connection string, or enter your database ceredentials individually.

[IMAGE HERE]

**Viewing Database Information**

After logging in, you'll see three sections - the side panel, the input box, and the database tables section. In the tables section, when you **hover** over a primary key in a table, any references to this **primary key** in other tables will be highlighted. Similarly, if you hover over a **foreign key** in a table, its related primary key will be highlighted.

Click on any table's **info** icon to view its information in the side panel.

Choose the **Search** option above the input box to filter which tables will be displayed. Als, you can **pin** tables to the top of the page for your convinience, by clicking on any table's pin icon.

[IMAGE HERE]

**Generating SQL queries**

You can write a **SQL SELECT query** in the SQL input box, or automatically generate a query by clicking on the rows of a table. Once your query is complete, click **execute query**. If your query has any errors, an error message will display telling you exactly where the error occured.

[IMAGE HERE]

**Viewing your data**

After clicking execute, you'll be able to see your results in the **Results** section. Clicking on a column name will sort your table data accordingly.
Also, you can filter which rows are visible by clicking the search icon next to each column name.

## Resources

---
