import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center text-center font-sans">
                    <h1 className="text-3xl text-red-500 font-bold mb-4">Ops! Algo deu errado.</h1>
                    <p className="text-gray-300 mb-4">Tivemos um problema técnico no seu dispositivo.</p>

                    <div className="bg-gray-900 p-4 rounded-lg text-left w-full max-w-lg overflow-auto border border-gray-700">
                        <p className="text-red-400 font-mono text-sm mb-2 font-bold">Erro: {this.state.error && this.state.error.toString()}</p>
                        <details className="text-xs text-gray-500 font-mono whitespace-pre-wrap">
                            <summary className="cursor-pointer mb-2 text-gray-400">Ver detalhes técnicos</summary>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                    >
                        Tentar Novamente
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
