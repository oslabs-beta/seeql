<p align="center">
<img width="250" alt="SeeQL Title" src="https://user-images.githubusercontent.com/29069478/60289605-ca915b80-98e4-11e9-943f-c40cb919c21e.png">
</p>

---

Welcome to **SeeQL (beta)**: An easy-to-use desktop application that helps you visualize your database tables (including all foreign and primary key relationships), to quickly generate complex queries. 


## Getting Started

#### Requirements

You'll need a Postgres database to connect to.

#### How to Install

Beta Release 0.0.1

**MacOS:** [seeql-0.0.1.dmg](https://github.com/oslabs-beta/seeql/releases/download/untagged-bc5bc2c547e0407d958d/SeeQL-0.0.1.dmg)

*Note:* For now you might need to go to your security settings to allow the app run on your system as we do not have an Apple license yet.

Or from the **terminal**, run:

```
git clone https://github.com/oslabs-beta/seeql.git
cd seeql
yarn
yarn run build
yarn start

```


## Features

**Logging In**

You have the option to log in with a `postgres://` URI connection string, or enter your database credentials individually.

![Login](https://user-images.githubusercontent.com/29069478/60288146-936d7b00-98e1-11e9-8bf3-2cffdef82ff0.gif)

**Viewing Database Information**

After logging in, you'll see three sections - the side panel, the input box, and the database tables section. In the tables section, when you **hover** over a primary key in a table, any references to this **primary key** in other tables will be highlighted. Similarly, if you hover over a **foreign key** in a table, its related primary key will be highlighted.

Click on any table's **info** icon to view its information in the side panel.

Choose the **Search** option above the input box to filter which tables will be displayed. You can **pin** tables to the top of the page for your convinience by clicking on any table's pin icon.

![seeql_viewqueryresults](https://user-images.githubusercontent.com/29069478/60289121-b567fd00-98e3-11e9-9225-dc5f4f7f3508.gif)

**Generating SQL queries & Viewing the results**

You can write a **SQL SELECT query** in the SQL input box, or automatically generate a query by clicking on the rows of a table. Once your query is complete, click **execute query**. If your query has any errors, an error message will display telling you exactly where the error occured.

![seeql_viewdbinfo](https://user-images.githubusercontent.com/29069478/60289008-6e7a0780-98e3-11e9-88eb-e339cec90a2f.gif)

After clicking execute, you'll be able to see your results in the **Results** section. Clicking on a column name will sort your table data accordingly.
You can filter which rows are visible by clicking the search icon next to each column name.


## Resources

Built on Electron, React and Typescript

**Creators:** [Kate Matthrews](http://github.com/katesmatthews), [Tyler Sayles](https://github.com/saylestyler), [Ariel Hyman](https://github.com/AHyman18), [Alice Wong](https://github.com/aliicewong)
