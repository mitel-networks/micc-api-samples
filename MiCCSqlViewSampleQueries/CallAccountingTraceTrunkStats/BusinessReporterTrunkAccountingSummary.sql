/********************************CallAccountingTraceTrunkStats View Example************************************************************************************************************************************
Business Reporter Trunk Accounting Summary Example
The Business Reporter Trunk Accounting Summary example returns a result set equivalent to the Business Reporter Trunk Accounting Summary report. If you want to report on alternate extensions replace the reporting number of the extension in the line TrunkReporting = 1.

NOTE: The Group By clause aggregates the data by call type so that one line of data is generated for each call type containing data. Call types without data will not appear in the output.
**************************************************************************************************************************************************************************************************************/
USE CCMData
GO

SELECT
[CallType]
,SUM(convert(int,[PegCount])) AS PegCount
,SUM([Cost]) AS Cost
,SUM([Duration]) AS Duration
FROM
CallAccountingTraceTrunkStats
WHERE
TrunkReporting = 1
AND
MidnightStartDate > 'October 1, 2021'
AND
MidnightStartDate < 'October 30, 2022'
GROUP BY
CallType
ORDER BY
Cost DESC