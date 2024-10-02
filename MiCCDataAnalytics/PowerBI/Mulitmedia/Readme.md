# Multimedia
This repository contains Power BI templates for the queues and agents of multimedia media servers.


## Queue

### MMCQueueReportDashboard
* This Power BI template is a report dashboard with a series of tabs designed to show what new data (outside MiCC-B standard reporting) is available for Multimedia conversations and interesting ways in which in can be used. The data model combines information from standard MiCC-B data tables and Consolidated Reporting 

The storage mode for this report dashboard is Direct

### MMCAgentReportDashboard
* This Power BI template is a report dashboard with a series of tabs designed to show information from standard MiCC-B multimedia tables for agent behavior. This template is an example of how exisitng data can be displayed using Power BI.

The storage mode for this report dashboard is Direct

### Collect the Database information
Before you can use the template in your environment you need to collect some information about the MiCC-B Server.
* The Instance name of the Sql Server
* A username and password which can be used to connect to SQL Server
* The authentication type for the connection ie. SQL or Windows

### Determine the Connectivity Mode 
Power BI supports two types of Connectivity: Import and Direct. The decision of which option is based on your specific company policy.  Things that may affect this decision include
* Are you using licensed version of Power BI?
* Are you connecting to live MiCC-B system?
* Are you connecting to a data warehouse?
* How often do you need the data to be refreshed

The two supported connectivity modes are Import and Direct. 
* Import pulls data into Power BI and requires refreshing. 
* Direct is a direct connection to the live database. 

There are pros and cons to both of these choices. It is recommended you review both options extensively to ensure you are not affecting the performance of MiCC-B.


### Use This Template in Your Environment 
To use this template in Your Environment follow these steps:

* Minimum MiCC-B version 10.0.0.0
* Download the file
* Open the file in Power BI Desktop or Power BI Service

### Setting the data properties for the template

#### Windows Authentication

If the authentication type is Windows
* Select GetData
* Set SQL Server Database
* Select Connect

#### SQL Authentication

If the authentication type is SQL
* Go To **File**: **Options and Settings**
* Select the correct SQL Server 
* Click **Edit Permissions**
* Select **Database** from the left-hand panel
* Enter the Username and password collected with respect to MiCC-B

NOTE: The SQL Server user must be granted Select and Execute permissions on the CCMData and CCMStatisticalData databases

### Refresh the data
Once the template is open and you have connected to the database, select the Refresh button on the toolbar

