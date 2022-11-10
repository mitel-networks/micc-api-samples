/********************************QueuePerformanceByPeriodStats Example******************************************
Maximum Available Agents Example
The Maximum Available Agents example calculates the maximum number of available agents. To return a result set on a specific queue group, replace ‘1’ in groups.Reporting = ‘1’ with the reporting number of the queue group you want to report on.


NOTE: The collected data is aggregated by month so that one line of data is generated for each month. Months that do not contain any data will not appear in the output.
****************************************************************************************************************************/
USE CCMData
GO

SELECT

DatePart(mm, [MidnightStartDate]) AS [Month],

SUM([QueueAnswered]) AS [TotalCallsAnswered],

 

-- Determine the maximum number of available agents

MAX([QueueAgentsAvailableMaximum]) AS MaximumAgentsAvailable
FROM
QueuePerformancebyPeriodStats
WHERE
[MidnightStartDate] > 'October 3, 2022'
AND
[MidnightStartDate] < 'October 4, 2022'

-- Group the results by month
GROUP BY
DatePart(mm, [MidnightStartDate])

-- Put the months in sequential order
ORDER BY
DatePart(mm, [MidnightStartDate])
 