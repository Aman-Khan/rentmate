import React from 'react';

function LoadingSpinner() {
    return (
        // Use Bootstrap's flexbox utilities for centering
        // minHeight: '100vh' ensures it takes full viewport height for centering
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            {/* Bootstrap spinner component */}
            <div className="spinner-border text-primary" role="status">
                {/* Visually hidden text for accessibility */}
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default LoadingSpinner;
