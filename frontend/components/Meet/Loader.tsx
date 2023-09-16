import React, { useState, useEffect } from "react";
import { useGame } from "@/contexts/MeetContext";
import styles from "./Loader.module.css";
import { Button, Card } from 'flowbite-react';
interface LoaderProps {
  color?: string;
  size?: string;
}

function Loader({ color, size }: LoaderProps) {

  let style = {
    borderTopColor: color || '#444',
    borderLeftColor: color || '#444',
    width: size || '40px',
    height: size || '40px'
  }
  return (
    <div> 
          <ul className={styles.bubbles}>
    {[...Array(7)].map((_, index) => (
      <li key={index} className={styles.bubble}></li>
    ))}
  </ul>
  
    </div>

  )
}

export default Loader;