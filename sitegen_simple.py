#!/usr/bin/env python3
"""
Simple Static Blog Generator
Converts markdown files to HTML blog posts with an index page.
"""

import os
import re
import shutil
from datetime import datetime
from pathlib import Path
import markdown
from markdown.extensions import meta


class CanvasProcessor:
    """Handles canvas element processing in markdown"""
    
    def __init__(self, js_source_dir="js"):
        self.js_source_dir = Path(js_source_dir)
    
    def process_canvas_tags(self, content, output_dir):
        """Process custom canvas tags in markdown content"""
        # Pattern to match: {{canvas:filename.js:canvas-id:width:height}}
        canvas_pattern = r'\{\{canvas:([^:]+):([^:]+):(\d+):(\d+)\}\}'
        
        def replace_canvas(match):
            js_file = match.group(1)
            canvas_id = match.group(2)
            width = match.group(3)
            height = match.group(4)
            
            # Copy JS file to output directory
            js_source = self.js_source_dir / js_file
            js_dest = output_dir / "js" / js_file
            
            if js_source.exists():
                js_dest.parent.mkdir(exist_ok=True)
                shutil.copy2(js_source, js_dest)
                
                # Generate canvas HTML
                canvas_html = f'''
<div class="canvas-container">
    <canvas id="{canvas_id}" width="{width}" height="{height}"></canvas>
</div>
<script src="js/{js_file}"></script>
'''
                return canvas_html
            else:
                return f'<p><em>Canvas JS file not found: {js_file}</em></p>'
        
        return re.sub(canvas_pattern, replace_canvas, content)


class BlogGenerator:
    def __init__(self, posts_dir="posts", output_dir="docs", partials_dir="partials", images_dir="images", js_dir="js"):
        self.posts_dir = Path(posts_dir)
        self.output_dir = Path(output_dir)
        self.partials_dir = Path(partials_dir)
        self.images_dir = Path(images_dir)
        self.js_dir = Path(js_dir)
        self.md = markdown.Markdown(extensions=['meta', 'codehilite', 'fenced_code'])
        self.canvas_processor = CanvasProcessor(js_dir)

    def copy_assets(self):
        """Copy images and other assets to output directory"""
        # Copy images
        if self.images_dir.exists():
            output_images = self.output_dir / "images"
            if output_images.exists():
                shutil.rmtree(output_images)
            shutil.copytree(self.images_dir, output_images)
            print(f"Copied images from {self.images_dir} to {output_images}")
        
        # Copy CSS if exists
        css_file = Path("style.css")
        if css_file.exists():
            shutil.copy2(css_file, self.output_dir / "style.css")
            print("Copied style.css")

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

        with open(self.partials_dir / "post_template.html", 'r', encoding='utf-8') as f:
            post_template = f.read()
        
        # Process canvas elements before markdown conversion
        content = self.canvas_processor.process_canvas_tags(content, self.output_dir)

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
        
        #post_template = self.get_template("post")
        # Create post HTML
        post_html = post_template.format(
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
        
        print("Loading index template...")
        with open(self.partials_dir / "index_template.html", 'r', encoding='utf-8') as f:
            index_template = f.read()
        
        # Sort posts by date (newest first)
        posts.sort(key=lambda x: x['file_date'], reverse=True)
        
        post_items = []
        for post in posts:
            post_item = f"""
        <li class="post-item">
            <h2 class="post-title">
                <a href="docs/{post['filename']}">{post['title']}</a>
            </h2>
            <div class="post-meta">
                {post['date']} • {post['read_time']} min read
            </div>
        </li>"""
            post_items.append(post_item)
        
        index_html = index_template.format(posts=''.join(post_items))
        
        # Write index file
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(index_html)
    
    def generate(self):
        """Generate the entire blog"""
        print("Starting blog generation...")
        
        # Create output directory
        self.output_dir.mkdir(exist_ok=True)
        
        # Copy assets (images, CSS, etc.)
        self.copy_assets()

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
    partials_dir = "partials"
    images_dir = "images"
    js_dir = "js"
    
    # Check if posts directory exists
    if not Path(posts_dir).exists():
        print(f"Posts directory '{posts_dir}' not found!")
    
    # Generate the blog
    generator = BlogGenerator(posts_dir, output_dir, partials_dir, images_dir, js_dir)
    generator.generate()

if __name__ == "__main__":
    main()
