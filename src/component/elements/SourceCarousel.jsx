// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CitationMarker from './CitationMarker';
import { useGlobalConfig } from '../providers/GlobalConfigContext';


const SourceCarousel = ({ sources }) => {
    
    const { theme  } = useGlobalConfig();

    const sourceStyle = {
        textColor: theme?.msgTextColor || "", 
        sourceBgColor: theme?.sourceBgColor || "",           //Default source background color, hex or rgb() string   
    }

    const carouselRef = useRef(null);
    const [showArrows, setShowArrows] = useState(false);

    const checkOverflow = () => {
        if (carouselRef.current) {
        const isOverflowing =
            carouselRef.current.scrollWidth > carouselRef.current.clientWidth;
        setShowArrows(isOverflowing);
        }
    };
  
    const scroll = (direction) => {
        if (carouselRef.current) {
        const scrollAmount = direction === 'left' ? -300 : 300;
        carouselRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth',
        });
        }
    };

    useEffect(() => {
        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => {
        window.removeEventListener('resize', checkOverflow);
        };
    }, []);

    return (
        <div className="relative w-full mb-6">
            {
                showArrows &&
                <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-400 
                              text-white p-2 rounded-full shadow opacity-50 hover:opacity-100 
                              transition-opacity duration-300 hover:bg-gray-200 z-10"
                    onClick={() => scroll('left')}
                >
                    <ChevronLeft size={14} className='text-black'/>
                </button>
            }      
            <div className='text-md pt-4 pb-2 text-gray-600' 
                style={{color: sourceStyle["textColor"]}}>
                <strong>Sources</strong>
            </div>
            <div
                ref={carouselRef}
                className="flex space-x-2 overflow-x-scroll no-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
            >
                
                {
                    sources.map((src, idx) =>  {
                        return <div className="flex-shrink-0 w-40 bg-[#fff] text-xs rounded-lg p-2" 
                                    style={{backgroundColor: sourceStyle["sourceBgColor"]}}
                                    key={`src-${src.title}-${idx}`} >                                
                                    <p className='line-clamp-3 text-gray-500 text-xs mt-0'
                                        style={{color: sourceStyle["textColor"]}}>
                                        {src.snippet}
                                    </p>
                                    <div className='mt-1 flex align-bottom'>                                        
                                        <CitationMarker number={src.citationNumber}/>                                        
                                        <a href={src.url} target="_blank" className="line-clamp-1 underline hover:text-blue-600"
                                            style={{color: sourceStyle["textColor"]}}>
                                            {src.title}
                                        </a>
                                        {/* <span style={{color: sourceStyle["textColor"]}}>{` • `}</span> */}                                        
                                    </div>
                                </div>
                    })
                }
            </div>
            {
                showArrows &&
                <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-400 
                               text-white p-2 rounded-full shadow opacity-50 hover:opacity-100 
                               transition-opacity duration-300 hover:bg-gray-200 z-10"
                    onClick={() => scroll('right')}
                >
                    <ChevronRight size={14} className='text-black'/>
                </button>
            }        
        </div>
  );
};

export default SourceCarousel;
