class DocumentsController < ApplicationController
  before_action :set_document, only: [:show]

  def index
    @documents = Document.all
  end

  def show
  end

  def new
    @document = Document.new
  end

  def create
    @document = Document.new(document_params)

    respond_to do |format|
      if @document.save
        format.html { redirect_to @document, notice: 'Document was successfully created.' }
        format.json { render :show, status: :created, location: @document }
      else
        format.html { render :new }
        format.json { render json: @document.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    def set_document
      @document = Document.find_by(token: params[:token])
    end

    def document_params
      params.require(:document).permit(:content, :encrypted)
    end
end
