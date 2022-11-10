/********************************AgentOutboundCallDetail Example*******************************************************************
AgentOutboundTraceStats View Example
The Agent Outbound Trace example returns a result set equivalent to the Agent Outbound Trace information. This example demonstrates how to return the 1000 most recent rows for a specific agent’s outbound calls between October 3, 2022 and October 4, 2022, grouping the calls by type and showing the number of calls, the total duration, and the average duration.
*
Agent Trace Data
From
AgentOutboundCallDetails
*************************************************************************************************************************************/

 USE CCMData
 GO

-- return top 1000 most recent rows
SELECT
TOP 1000 *
FROM
AgentOutboundCallDetails
ORDER BY
[MidnightStartDateTime] DESC

-- return top 1000 most recent rows using agent name
SELECT
TOP 1000 *
FROM
AgentOutboundCallDetails
WHERE
[AgentFirstName] = 'John'
AND
[AgentLastName] = 'Doe'
ORDER BY
[MidnightStartDateTime] DESC

-- Select the calls and the call type of the calls made by the agent
--for October 3, 2022

SELECT
[CallStartTime],
[CallType],
[PhoneNumber],
[Duration] AS [Total Outbound Duration]
FROM
AgentOutboundCallDetails
WHERE
[AgentReporting] = '1522'
AND
[MidnightStartDateTime] > 'October 3, 2022'
AND
[MidnightStartDateTime] < 'October 4, 2022'
order by CallStartTime
 
-- Group the calls by type and show the number of calls, the total duration and the average duration
SELECT
[CallType],
Count(MidnightStartDateTime) as [Number of Calls],
Sum([Duration]) AS [Total Outbound Duration],
case
when Count(MidnightStartDateTime) < 0 then 0
else convert(float, Sum([Duration]))/Convert(Float, Count(MidnightStartDateTime))
end as [Average Duration Per Call]
FROM
AgentOutboundCallDetails
WHERE
[AgentReporting] = '1522'
AND
[MidnightStartDateTime] > 'October 3, 2022'
AND
[MidnightStartDateTime] < 'October 4, 2022'
Group by CallType
Order by CallType