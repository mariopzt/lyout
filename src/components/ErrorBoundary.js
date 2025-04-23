import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // También puedes enviar el error a un servicio externo aquí
    console.error('ErrorBoundary atrapó un error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#ffeaea', color: '#b71c1c', padding: 24, borderRadius: 8, margin: 24 }}>
          <h2>¡Ha ocurrido un error inesperado!</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <p>Por favor, recarga la página o contacta al administrador.</p>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;
