package server

import (
	"net/http"
	"time"
)

// Serve parameters Server with protection
func ServerParameters(handler http.Handler, Request int) *http.Server {
	return &http.Server{
		Addr:              "127.0.0.1:8080",
		ReadTimeout:       10 * time.Second,
		ReadHeaderTimeout: 5 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       120 * time.Second,
		MaxHeaderBytes:    1 << 20,
		//Call CorsMiddleware, for eachRequest
		Handler: EnableCors(handler),
	}
}

// Middleware
func EnableCors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//Limit requests by this address
		path := r.Header.Get("Origin")
		if path == "http://localhost:3000" {
			w.Header().Set("Access-Control-Allow-Origin", path)
		}
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
