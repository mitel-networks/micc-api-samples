# MiCC-B Reporting Dashboards using Power BI

This is a public repository with samples using Power BI created reporting dashboards [MiCC](http://www.mitel.com/products/collaboration-software/micontact-center-business) for the following areas:

* Served by data from MiCC-B's SQL Server instance
* Representing configuration devices programmed in MiCC-B YourSite Explorer

## The Templates
The files contained in these repositories are Power BI files containing a data model and multiple visualizations built on MiCC-B supported SQL Views

Interested parties must be:
* familiar with Power BI Desktop and/or Power BI Service
* have activated a Power BI account with which they can logged in to Power BI
* have access to the Sql Server instance for MiCC-B

## Power BI
If you are not yet familiar with Power BI, information and tutorials can be found online. Please consult the Power BI [site](https://powerbi.microsoft.com/en-us/)
 website for information and training tools

## Collect the MICC-B Database information
Getting access to MiCC-B data the Reportind Dashboard visualizes
* The source of data for the templates in this repository are SQL Views on the MiCC-B SQL Server instance
* Interested parties connect to the Sql Server (or Data Wharehouse) via a SQL Data Source connection configured by Power BI

Before you can use the template in your environment you need to collect some information about the MiCC-B Server.
* The Instance name of the Sql Server
* A username and password which can be used to connect to SQL Server
* The authenticattion type for the connection ie. SQL or Windows

The Sql User account on the MiCC-B SQL Instance must be granted
* Select permission
* Execute permissions (The Sql Views make use of UDF's)

### Determine the Power BI Connectivity Mode 
These templates are configured to use a SQL Server database as a datasource.

Power BI supports two types of Connectivity: Import and Direct. The decision of which option is based on your specific company policy.  Things that may affect this decision include
* Are you using licensed version of Power BI?
* Are you connecting to live MiCC-B system?
* Are you connecting to a data warehouse?
* How often do you need the data to be refreshed

The two supported connectivity modes are Import and Direct. 
* Import pulls data into Power BI and requires refreshing. 
* Direct is a direct connnection to the live database. 

There are pros and cons to both of these choices. It is recommended you review both options extensively to ensure you are not affecting the performance of MiCC-B.

### Supporting SQL Authentication for the template

If the authentication type is SQL

* Go To **File**: **Options and Settings**
* Select the correct SQL Server 
* Click **Edit Permissions**
* Select **Database** from the left hand panel
* Enter the Username and password collected with respect to MiCC-B

NOTE: The SQL Server user must be granted Select and Execute permissions on the CCMData and CCMStatisticalData databases
