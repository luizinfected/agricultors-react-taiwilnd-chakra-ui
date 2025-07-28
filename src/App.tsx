import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'


//components
import { Footer } from './components/Footer'

//pages
import { Home } from './pages/Home'
import { View } from './pages/View'
import { Farmers } from './pages/Farmers'

type Routes = 'home' | 'farmers' | 'viewFarmer'

function App() {

    const [routes, setRoutes] = useState<Routes>('home')

    return (
        <div className="min-h-screen bg-[#242424] flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={routes}
                    initial={{ x: 1000, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -1000, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="flex-1"
                >
                    {routes === 'home' && <Home setRoutes={setRoutes} />}
                    {routes === 'farmers' && <Farmers setRoutes={setRoutes} /> }
                    {routes === 'viewFarmer' && <View setRoutes={setRoutes} /> }
                </motion.div>
            </AnimatePresence>
            <Footer />
        </div>
    )
}

export default App

