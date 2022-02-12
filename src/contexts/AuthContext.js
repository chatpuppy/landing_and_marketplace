import React, { useContext, useState } from 'react'

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const [ currentAccount, setCurrentAccount] = useState()
    const [ ownedNFTs, setOwnedNFTs] = useState();
    const [ currentNetwork, setCurrentNetwork ] = useState()

    const value = {
        currentAccount, setCurrentAccount,
        ownedNFTs, setOwnedNFTs,
        currentNetwork, setCurrentNetwork
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
