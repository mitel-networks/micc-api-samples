/********************************CallAccountingTraceTrunkStats View Example************************************************************************************************************************************
Business Reporter Trunk Accounting by Interval Example
The Business Reporter Trunk Accounting by Interval example returns a result set equivalent to the Business Reporter Trunk Accounting by Interval report. This example demonstrates how to calculate an average using real numbers and integer math and avoids dividing by zero. If you want to report on alternate extensions replace the reporting number of the extension in the line TrunkReporting = 1.

NOTE: The Group By clause aggregates the time intervals and call types so that one line of data is generated for each time interval and call type containing data. Time intervals that do not contain any data will not appear in the output.
**************************************************************************************************************************************************************************************************************/
 USE CCMData
 GO

SELECT
[TimeIntervalID]
,[MidnightStartDate]
,[CallType]
,SUM(convert(int,[PegCount])) AS TotalCallCount
,SUM([Duration]) AS TotalDuration
,SUM([Cost]) AS TotalCost
-- If the denominator is zero
,CASE SUM(convert(int,[PegCount]))
-- Avoid dividing by zero and return zero
WHEN 0 THEN 0
--Use Real math to calculate the average ACD duration
ELSE convert(float,SUM([Duration])) / SUM(convert(float,[PegCount]))
END AS AverageDuration
-- If the denominator is zero
,CASE SUM(convert(int,[PegCount]))
-- Avoid dividing by zero and return zero
WHEN 0 THEN 0
--Use Integer math to calculate the average cost
ELSE SUM([Cost]) / SUM(convert(int,[PegCount]))
END AS AverageCost
FROM
CallAccountingTraceTrunkStats
WHERE
TrunkReporting = 1
AND
MidnightStartDate > 'October 1, 2021'
AND
MidnightStartDate < 'October 30, 2022'
-- This is the By Interval part of the example
GROUP BY
TimeIntervalID, MidnightStartDate, CallType
ORDER BY
--Ensure that intervals are correctly ordered
TimeIntervalID