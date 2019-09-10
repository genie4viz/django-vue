import React from 'react';

const CompassSprite = () => {
    return (
        <div className="animated-compass">
            <svg 
                version="1.1" 
                id="Calque_1" 
                xmlns="http://www.w3.org/2000/svg" 
                xlinkHref="http://www.w3.org/1999/xlink" 
                x="0px" 
                y="0px"
                viewBox="0 0 1008 612" 
                preserveAspectRatio="xMidYMid meet" 
                enableBackground="new 0 0 1008 612" 
                xmlSpace="preserve">
                <title>Voir la Carte</title>
                <g>
                    <path 
                        className="line-6oclock" 
                        fill="#FFFFFF" 
                        d="M504,440.425c-4.716,0-8.49,3.773-8.49,8.49v44.336c0,4.718,3.773,8.491,8.49,8.491
                        c4.717,0,8.489-3.773,8.489-8.491v-44.336C512.019,444.198,508.717,440.425,504,440.425z"
                        />
                    <path 
                        className="line-9oclock" 
                        fill="#FFFFFF" 
                        d="M370.047,305.057c0-4.717-3.773-8.49-8.49-8.49h-43.865c-4.716,0-8.49,3.773-8.49,8.49
                        s3.773,8.49,8.49,8.49h43.865C366.273,313.075,370.047,309.773,370.047,305.057z"
                        />
                    <path 
                        className="line-3oclock" 
                        fill="#FFFFFF" 
                        d="M691.724,296.566H648.33c-4.717,0-8.49,3.773-8.49,8.49s3.773,8.49,8.49,8.49h43.394
                        c4.717,0,8.49-3.773,8.49-8.49C699.742,300.34,695.969,296.566,691.724,296.566z"
                        />
                    <path 
                        className="line-12oclock" 
                        fill="#FFFFFF" 
                        d="M504,170.632c4.717,0,8.489-3.773,8.489-8.49V119.22c0-4.717-3.772-8.49-8.489-8.49
                        c-4.716,0-8.49,3.773-8.49,8.49v42.922C495.51,167.33,499.284,170.632,504,170.632z"
                        />
                    <path 
                        className="needle" 
                        fill="#FFFFFF" 
                        d="M662.008,147.52c-4.716-4.245-10.376-6.604-16.508-6.604c-3.773,0-7.075,0.943-10.377,2.358L447.4,237.608
                        c-4.245,2.358-8.019,5.66-10.376,10.376L342.218,436.18c-4.716,8.962-2.83,19.811,4.245,26.886
                        c4.716,4.716,10.376,7.075,16.508,7.075c3.302,0,7.075-0.944,10.376-2.359l188.667-93.86c4.716-2.359,8.489-6.133,10.376-10.378
                        l93.862-188.667C670.97,165.443,669.083,154.595,662.008,147.52z M551.638,352.695l-188.666,93.862l95.277-188.196L645.5,164.028
                        L551.638,352.695z"
                        />
                    <path 
                        className="middle-dot" 
                        fill="#FFFFFF" 
                        d="M504.472,268.738c-20.282,0-36.79,16.508-36.79,36.791c0,20.281,16.508,36.79,36.79,36.79
                        c20.282,0,36.79-16.509,36.79-36.79C541.262,285.247,524.754,268.738,504.472,268.738z M504.472,325.339
                        c-10.848,0-19.81-8.963-19.81-19.81c0-10.849,8.962-19.811,19.81-19.811c10.849,0,19.81,8.961,19.81,19.811
                        C524.754,316.376,515.792,325.339,504.472,325.339z"
                        />
                    <path 
                        className="circle" 
                        fill="#FFFFFF" 
                        d="M504,23c-156.122,0-283,126.878-283,283c0,156.121,126.878,283,283,283c156.121,0,283-126.879,283-283
                        C787,149.878,660.121,23,504,23z M504,565.417c-142.915,0-259.417-116.502-259.417-259.417S361.085,46.583,504,46.583
                        S763.417,163.085,763.417,306C763.417,448.915,646.915,565.417,504,565.417z"
                        />
                </g>
            </svg>
        </div>
    );
};

export default CompassSprite;