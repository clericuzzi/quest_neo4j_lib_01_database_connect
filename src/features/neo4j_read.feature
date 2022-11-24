Feature: Connect to a Neo4J database

  Rule: the database host must be provided at process.env.NEO4J_HOST

  Rule: the database user must be provided at process.env.NEO4J_USER

  Rule: the database pass must be provided at process.env.NEO4J_PASS

  Rule: the database must be provided at process.env.NEO4J_BASE

  Rule: all four environment variables must be provided, if not an error has to be thrown

  Rule: the function name must be readFromNeo4J

    Background: 
      Given the table data is defined as
        | id | country   |
        |  1 | Brazil    |
        |  2 | Argentina |
        |  3 | Uruguay   |

    Scenario Outline: when an environment variable is not defined
      Given that <envVar> is not provided
      When trying to fetch data with "select * from south_american_world_cup_winner"
      Then expect the error object to contain
        | code        | message        |
        | <errorCode> | <errorMessage> |

      Examples: 
        | envVar     | errorCode | errorMessage                            |
        | NEO4J_HOST |         1 | process.env.NEO4J_HOST was not provided |
        | NEO4J_USER |         2 | process.env.NEO4J_USER was not provided |
        | NEO4J_PASS |         3 | process.env.NEO4J_PASS was not provided |
        | NEO4J_BASE |         4 | process.env.NEO4J_BASE was not provided |

    Scenario: select all south american workd cup winners from table_01
      When trying to fetch data with "select * from south_american_world_cup_winner"
      Then expect the data returned to look like
        | id | country   |
        |  1 | Brazil    |
        |  2 | Argentina |
        |  3 | Uruguay   |
