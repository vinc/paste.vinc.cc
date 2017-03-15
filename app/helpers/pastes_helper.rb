module PastesHelper
  RENDER_OPTIONS = {
    filter_html: true,
    hard_wrap: true,
    link_attributes: { rel: 'nofollow' }
  }
  ENGINE_OPTIONS = {
    fenced_code_blocks: true,
    autolink: true
  }

  def render_markup(content)
    renderer = Redcarpet::Render::HTML.new(RENDER_OPTIONS)
    markdown = Redcarpet::Markdown.new(renderer, ENGINE_OPTIONS)

    markdown.render(content).html_safe
  end
end
