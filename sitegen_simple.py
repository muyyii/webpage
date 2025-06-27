#!/usr/bin/env python3
"""
Simple Static Blog Generator
Converts markdown files to HTML blog posts with an index page.
"""

import os
import re
from datetime import datetime
from pathlib import Path
import markdown
from markdown.extensions import meta

# HTML Templates
INDEX_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Blog</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="header">
        <h1>My Blog</h1>
        <p>Welcome to my personal blog</p>
    </div>
    
    <ul class="post-list">
        {posts}
    </ul>
</body>
</html>"""

POST_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - My Blog</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="back-link">
        <a href="index.html">← Back to Blog</a>
    </div>
    
    <article>
        <div class="post-header">
            <h1 class="post-title">{title}</h1>
            <div class="post-meta">
                Published on {date} • {read_time} min read
            </div>
        </div>
        
        <div class="post-content">
            {content}
        </div>
    </article>
</body>
</html>"""

class BlogGenerator:
    def __init__(self, posts_dir="posts", output_dir="docs"):
        self.posts_dir = Path(posts_dir)
        self.output_dir = Path(output_dir)
        self.md = markdown.Markdown(extensions=['meta', 'codehilite', 'fenced_code'])
        
    def estimate_read_time(self, text):
        """Estimate reading time based on word count (200 words per minute)"""
        word_count = len(text.split())
        read_time = max(1, round(word_count / 200))
        return read_time
    
    def extract_metadata(self, content):
        """Extract title and date from markdown metadata or content"""
        # Convert markdown to get metadata
        html = self.md.convert(content)
        meta = self.md.Meta if hasattr(self.md, 'Meta') else {}
        
        # Try to get title from meta, otherwise from first h1
        title = None
        if 'title' in meta:
            title = ' '.join(meta['title'])
        else:
            # Look for first h1 in content
            h1_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
            if h1_match:
                title = h1_match.group(1)
        
        # Try to get date from meta, otherwise use file modification time
        date = None
        if 'date' in meta:
            date = ' '.join(meta['date'])
        
        # Reset markdown instance for next use
        self.md.reset()
        
        return title, date, html
    
    def process_post(self, md_file):
        """Process a single markdown file into HTML"""
        print(f"Processing {md_file.name}...")
        
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract metadata and convert to HTML
        title, date, html_content = self.extract_metadata(content)
        
        # Use filename as fallback title
        if not title:
            title = md_file.stem.replace('-', ' ').replace('_', ' ').title()
        
        # Use file modification time as fallback date
        if not date:
            date = datetime.fromtimestamp(md_file.stat().st_mtime).strftime('%B %d, %Y')
        
        # Estimate reading time
        read_time = self.estimate_read_time(content)
        
        # Generate HTML filename
        html_filename = md_file.stem + '.html'
        
        # Create post HTML
        post_html = POST_TEMPLATE.format(
            title=title,
            date=date,
            read_time=read_time,
            content=html_content
        )
        
        # Write HTML file
        output_path = self.output_dir / html_filename
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(post_html)
        
        return {
            'title': title,
            'date': date,
            'read_time': read_time,
            'filename': html_filename,
            'file_date': md_file.stat().st_mtime
        }
    
    def generate_index(self, posts):
        """Generate the index page with all blog posts"""
        print("Generating index...")
        
        # Sort posts by date (newest first)
        posts.sort(key=lambda x: x['file_date'], reverse=True)
        
        post_items = []
        for post in posts:
            post_item = f"""
        <li class="post-item">
            <h2 class="post-title">
                <a href="{post['filename']}">{post['title']}</a>
            </h2>
            <div class="post-meta">
                {post['date']} • {post['read_time']} min read
            </div>
        </li>"""
            post_items.append(post_item)
        
        index_html = INDEX_TEMPLATE.format(posts=''.join(post_items))
        
        # Write index file
        with open(self.output_dir / 'index.html', 'w', encoding='utf-8') as f:
            f.write(index_html)
    
    def generate(self):
        """Generate the entire blog"""
        print("Starting blog generation...")
        
        # Create output directory
        self.output_dir.mkdir(exist_ok=True)
        
        # Find all markdown files
        md_files = list(self.posts_dir.glob('*.md'))
        
        if not md_files:
            print(f"No markdown files found in {self.posts_dir}")
            return
        
        print(f"Found {len(md_files)} markdown files")
        
        # Process each markdown file
        posts = []
        for md_file in md_files:
            try:
                post_data = self.process_post(md_file)
                posts.append(post_data)
            except Exception as e:
                print(f"Error processing {md_file}: {e}")
        
        # Generate index page
        if posts:
            self.generate_index(posts)
            print(f"\nBlog generated successfully!")
            print(f"Output directory: {self.output_dir}")
            print(f"Generated {len(posts)} posts + index page")
        else:
            print("No posts were successfully generated")

def main():
    """Main function to run the blog generator"""
    import sys
    
    # You can customize these paths
    posts_dir = "posts"
    output_dir = "docs"
    
    # Check if posts directory exists
    if not Path(posts_dir).exists():
        print(f"Posts directory '{posts_dir}' not found!")
        print("Creating example directory and files...")
        
        # Create example structure
        Path(posts_dir).mkdir(exist_ok=True)
        
        # Create example markdown files
        example_post1 = """---
title: My First Blog Post
date: December 20, 2024
---

# My First Blog Post

This is my first blog post! I'm excited to share my thoughts with the world.

## What I'll Write About

I plan to write about:
- Technology
- Programming
- Life experiences

Thanks for reading!
"""
        
        example_post2 = """# Welcome to My Blog

This is another example post. You can write in **markdown** format.

## Features

- Easy to write
- Automatic HTML conversion
- Reading time estimation

```python
print("Hello, World!")
```

> This is a quote example

Enjoy blogging!
"""
        
        with open(Path(posts_dir) / "first-post.md", "w") as f:
            f.write(example_post1)
        
        with open(Path(posts_dir) / "welcome.md", "w") as f:
            f.write(example_post2)
        
        print(f"Created example posts in '{posts_dir}' directory")
    
    # Generate the blog
    generator = BlogGenerator(posts_dir, output_dir)
    generator.generate()

if __name__ == "__main__":
    main()
