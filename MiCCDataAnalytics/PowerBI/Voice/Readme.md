# Voice	
This repository contains Power BI templates for devices types connected to Voice media servers.

## Queue Groups

### QueueGroupReportDashboard

* This template contains statistics for Queue Groups and Queues. The visualizations contained in this report dashboard represents call counts, service levels, time metrics and call details.

The storage mode for this report dashboard is Import

Required MiCC-B 10.0.0.0

### QueueGroupReportDashboard_V2
* This template contains the same statistics as the QueueGroupReportDashboard. The difference between the two is the Storage mode. 

The storage mode for this report dashboard is Direct

Required MiCC-B 10.1.0.0

NOTE: It is not possible in Power BI to go from Import to Direct Storage Mode easily. To convert, the Data Model has to be deleted and recreated.  The Data Model contains many custom measure specific to contact centers. All Power BI templates moving forward will be created using a Direct storage mode in order to preserve custom measure in the event a customer needs to adhere to a specific Storage Mode as per their organizations requirements.

### AgentGroupReportDashboard
* This template contains statistics for Agent Groups and Agents. The visualizations contained in this report dashboard represent a mix of agent event behavior and call based statistics. Each tab in the report contains a textbox explaining how the data is derived and if possible indicates a comparable report in standard MiCC-B reports.

The storage mode for this report dashboard is Direct

Required MiCC-B 10.1.0.0


### Collect the Database information
Before you can use the template in your environment you need to collect some information about the MiCC-B Server.
* The Instance name of the Sql Server
* A username and password which can be used to connect to SQL Server
* The authenticattion type for the connection ie. SQL or Windows

### Determine the Connectivity Mode 
Power BI supports two types of Connectivity: Import and Direct. The decision of which option is based on your specific company policy.  Things that may affect this decision include
* Are you using licensed version of Power BI?
* Are you connecting to live MiCC-B system?
* Are you connecting to a data warehouse?
* How often do you need the data to be refreshed

The two supported connectivity modes are Import and Direct. 
* Import pulls data into Power BI and requires refreshing. 
* Direct is a direct connnection to the live database. 

There are pros and cons to both of these choices. It is recommended you review both options extensively to ensure you are not affecting the performance of MiCC-B.


### Use This Template in Your Environment 
To use this template in Your Enviroment follow these steps:

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
* Select **Database** from the left hand panel
* Enter the Username and password collected with respect to MiCC-B

NOTE: The SQL Server user must be granted Select and Execute permissions on the CCMData and CCMStatisticalData databases

### Refresh the data
Once the template is open and you have connected to the database, select the Refresh button on the toolbar

