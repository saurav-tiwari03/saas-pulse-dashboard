package logger

import (
	"os"

	"github.com/rs/zerolog"
)

var log zerolog.Logger

func init() {
	// Configure zerolog with pretty console output for development
	output := zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: "2006-01-02 15:04:05"}
	log = zerolog.New(output).With().Timestamp().Logger()
}

// Info logs an informational message with optional key-value pairs
func Info(msg string, keysAndValues ...interface{}) {
	event := log.Info()
	addFields(event, keysAndValues...)
	event.Msg(msg)
}

// Error logs an error message with optional key-value pairs
func Error(msg string, keysAndValues ...interface{}) {
	event := log.Error()
	addFields(event, keysAndValues...)
	event.Msg(msg)
}

// Debug logs a debug message with optional key-value pairs
func Debug(msg string, keysAndValues ...interface{}) {
	event := log.Debug()
	addFields(event, keysAndValues...)
	event.Msg(msg)
}

// Warn logs a warning message with optional key-value pairs
func Warn(msg string, keysAndValues ...interface{}) {
	event := log.Warn()
	addFields(event, keysAndValues...)
	event.Msg(msg)
}

// addFields adds key-value pairs to the log event
func addFields(event *zerolog.Event, keysAndValues ...interface{}) {
	for i := 0; i < len(keysAndValues)-1; i += 2 {
		key, ok := keysAndValues[i].(string)
		if !ok {
			continue
		}
		event.Interface(key, keysAndValues[i+1])
	}
}
