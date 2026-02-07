package logger

import (
	"fmt"
	"os"
	"strings"

	"github.com/rs/zerolog"
)

// Interface -.
type Interface interface {
	Debug(message string, args ...interface{})
	Info(message string, args ...interface{})
	Warn(message string, args ...interface{})
	Error(err error, args ...interface{})
	Fatal(err error, args ...interface{})
}

// Logger -.
type Logger struct {
	logger *zerolog.Logger
}

var _ Interface = (*Logger)(nil)

// New -.
func New(level string) *Logger {
	var l zerolog.Level

	switch strings.ToLower(level) {
	case "error":
		l = zerolog.ErrorLevel
	case "warn":
		l = zerolog.WarnLevel
	case "info":
		l = zerolog.InfoLevel
	case "debug":
		l = zerolog.DebugLevel
	default:
		l = zerolog.InfoLevel
	}

	zerolog.SetGlobalLevel(l)

	// Create logger without caller information for cleaner output
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()

	return &Logger{
		logger: &logger,
	}
}

// Debug -.
func (l *Logger) Debug(message string, args ...interface{}) {
	l.msg("debug", message, args...)
}

// Info -.
func (l *Logger) Info(message string, args ...interface{}) {
	l.msg("info", message, args...)
}

// Warn -.
func (l *Logger) Warn(message string, args ...interface{}) {
	l.msg("warn", message, args...)
}

// Error -.
func (l *Logger) Error(err error, args ...interface{}) {
	if err != nil {
		args = append(args, "error", err.Error())
	}
	l.msg("error", "ERROR", args...)
}

// Fatal -.
func (l *Logger) Fatal(err error, args ...interface{}) {
	if err != nil {
		args = append(args, "error", err.Error())
	}
	l.msg("fatal", "FATAL", args...)
	os.Exit(1)
}

func (l *Logger) msg(level string, message string, args ...interface{}) {
	var event *zerolog.Event

	switch level {
	case "debug":
		event = l.logger.Debug()
	case "info":
		event = l.logger.Info()
	case "warn":
		event = l.logger.Warn()
	case "error":
		event = l.logger.Error()
	case "fatal":
		event = l.logger.Fatal()
	default:
		event = l.logger.Info()
	}

	if len(args) > 0 {
		for i := 0; i < len(args); i += 2 {
			if i+1 < len(args) {
				event = event.Interface(fmt.Sprintf("%v", args[i]), args[i+1])
			}
		}
	}

	event.Msg(message)
}
