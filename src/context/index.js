"use client"

import {useContext,createContext,useState} from 'react'

const AppContext = createContext({
    fmonth: 'Jan'
});
export function AppWrapper({ children }){
    let [fmonth,setFMonth]= useState({
        fmonth:'Jan'});
    return(
        <AppContext.Provider value={fmonth}>
            {children}
        </AppContext.Provider>
    )
}
export function useAppContext(){
    return useContext(AppContext)
}