import React from 'react'
import { useColorMode, Button } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export default function ToggleTheme() {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
      <header>
        <Button size="lg" onClick={toggleColorMode} variant="ghost">
          {colorMode === "light" ? <MoonIcon />  : <SunIcon />}
        </Button>
      </header>
    )
}