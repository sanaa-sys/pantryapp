//import Image from "next/image";
//import styles from "./page.module.css";
import React from 'react';
import PantryForm from '@/components/PantryForm';


const Home = () => {
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-2  md:p-24 gap-y-7">
          
            <PantryForm />
    
       
        </main>
    );
};

export default Home;

