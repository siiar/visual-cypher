*  Last Parent Will have remove option
*  Last Child for each parent will have remove options

query = {
      0: {
        "match_clause": {
          0: {"node_clause": {}},
          1: {"link_clause": {}},
          2: {"node_clause": {}}
        }
      },
      1: {
        "where_clause": {
          0: {"plain_clause":{}}
        }
      },
      2: {
        "return_clause": {
          0: {"plain_clause": {}}
        }
      },
      3: {
        "order_by_clause": {
          0: {"plain_clause": {}}
        }
      },
      4: {
        "skip_clause": {
          0: {"plain_clause": {}}
        }
      },
      5: {
        "limit_clause": {
          0: {"plain_clause": {}}
        }
      }
    }