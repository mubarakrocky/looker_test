import React, {useEffect, useState} from "react";
import {Query, Visualization} from '@looker/visualizations'
import { looker40sdk } from './CorsSessionHelper'
import styled from 'styled-components'
import {sampleQuery} from "./SampleQuery";
import {DataProvider} from "@looker/components-data";

const PageTitle = styled.div`
  font-family: "Google Sans", "Open Sans", Arial, Helvetica, sans-serif;
  font-size: 26px;
  color: #5F6368;
  font-weight: 200;
  margin-left: 3rem;
  }
`

export function EmbedComponent() {
    const [queryId, updateQueryId] = useState(null)

    useEffect(() => {
        looker40sdk.ok(looker40sdk.create_query(JSON.stringify(sampleQuery), 'id'))
            .then(res => updateQueryId(res.id))
        // The second argument to the effect is an array of elements to 'watch'.
        // An empty array like this makes the effect execute only once.
    }, [])

    if (queryId === null) {
        return <p>Creating query</p>
    }

    return(
        <DataProvider sdk={looker40sdk}>
            <PageTitle>Visualization Component</PageTitle>
            <Query
                sdk={looker40sdk}
                query={queryId}
            >
                <Visualization />
            </Query>
        </DataProvider>
    )
}
