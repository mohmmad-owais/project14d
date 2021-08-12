import React, { useState, useRef, useEffect } from "react"
import { addSentResult } from "../graphql/mutations"
import { getReport } from "../graphql/queries"
import { API, graphqlOperation } from "aws-amplify"
import "./style.css"

import { makeStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"

interface itemTypes {
  petname: string
  id: string
  result: string
  status: string
}

interface incomingData {
  data: {
    getReport: itemTypes[]
  }
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [petData, setPetData] = useState<incomingData | null>(null)

  const addSentResults = async (petname: string, id: string) => {
    try {
      const sent = {
        id: id,
        petname: petname,
        status: "Sucess",
        result: "Positive",
      }
      const data = await API.graphql({
        query: addSentResult,
        variables: {
          sent: sent,
        },
      })
      alert("Email Sent Sucessfully")
      fetchTodos()
    } catch (e) {
      console.log(e)
    }
  }

  const fetchTodos = async () => {
    try {
      const data = await API.graphql({
        query: getReport,
      })
      setPetData(data as incomingData)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="container">
      {loading ? (
        <h1>Loading ...</h1>
      ) : (
        <div>
          <h2>Project 14D</h2>
          <h2>Pet Theory System</h2>
          <label>Lab Reports:</label>

          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="center">Petname</TableCell>
                  <TableCell align="center">Result</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {petData.data &&
                  petData.data.getReport.map((item, ind) => (
                    <TableRow key={ind}>
                      <TableCell component="th" scope="row">
                        {item.id}
                      </TableCell>
                      <TableCell align="center">{item.petname}</TableCell>
                      <TableCell align="center">{item.result}</TableCell>
                      <Button
                        onClick={() => addSentResults(item.petname, item.id)}
                      >
                        Send
                      </Button>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  )
}
