#!/bin/bash

# Find all JavaScript files in the current directory and its subdirectories
js_files=$(find . -type f -name "*.js")

# Loop through each JavaScript file
for js_file in $js_files; do
    # Create the new TypeScript file name by replacing ".js" with ".ts"
    ts_file="${js_file%.js}.ts"
    
    # Rename the JavaScript file to the TypeScript file
    mv "$js_file" "$ts_file"
done
