import { Box, Button, Flex, Input } from "@chakra-ui/react"

/* eslint-disable react/prop-types */
export default function EnvironmentVariablesSetup({environmentVariables, setEnvironmentVariables}){
  function addNewEnvironmentVariable(){
    setEnvironmentVariables([...environmentVariables, {key: "", value: ""}])
  }
  function removeEnvironmentVariable(index){
    setEnvironmentVariables(environmentVariables.filter((_, i) => i !== index))
  }
  function handleEnvironmentVariableChange(index, key, value){
    const newEnvironmentVariables = [...environmentVariables]
    newEnvironmentVariables[index] = {key, value}
    setEnvironmentVariables(newEnvironmentVariables)
  }
  return (
    <>
      <Box>
        <Button w="100%" colorScheme="brand" onClick={addNewEnvironmentVariable}>Add Environment Variable</Button>
      </Box>
      <Box my="20px">
        {environmentVariables.map((environmentVariable, index) => (
          <Flex key={index} gap="10px" mb="8px">
            <Input placeholder="Key" value={environmentVariable.key} onChange={(e) => handleEnvironmentVariableChange(index, e.target.value, environmentVariable.value)} />
            <Input placeholder="Value" value={environmentVariable.value} onChange={(e) => handleEnvironmentVariableChange(index, environmentVariable.key, e.target.value)} />
            <Button colorScheme="red" w="40%" onClick={() => removeEnvironmentVariable(index)}>
              
              Remove</Button>
          </Flex>
        ))}
      </Box>

    </>
  )
}