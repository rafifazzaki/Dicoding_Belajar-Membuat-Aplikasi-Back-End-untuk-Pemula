class NotesHandler{
    constructor(service){
        this._service = service;
    }

    postNoteHandler(request, h){
        const { title = 'untitled', body, tags } = request.payload;

        const NoteId = this._service.addNote({title, body, tags});

        try {
            const response = h.response({
                status: 'success',
                message: 'Catatan berhasil ditambahkan',
                data: {
                    NoteId,
                },
            });
            response.code(201);
            return response;

        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(400);
            return response;
        }
    }

    getNotesHandler(){
        const notes = this._service.getNotesHandler();
        return{
            status: 'success',
            data: {
                notes
            }
        };
    }

    getNoteByIdHandler(request, h){
        const { id } = request.params;
        const note = this._service.getNoteByIdHandler(id);

        try {
            return {
                status: 'success',
                data: {
                  note,
                },
              };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message
            })
            response.code(404);
            return response;
        }
        
    }

    putNoteByIdHandler(request, h){
        const { id } = request.params;

        this._service.putNoteByIdHandler(id, request.payload);

        try {
            return{
                status: 'success',
                message: 'Catatan berhasil diperbarui'
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message
            })
            response.code(404);
            return response;
        }
    }

    deleteNoteByIdHandler(request, h){
        const { id } = request.params;

        this._service.deleteNoteByIdHandler(id);

        try {
            return{
                status: 'success',
                message: 'Catatan berhasil dihapus'
            }
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message
            });
            response.code(404)
            return response
        }
    }
}

module.exports = NotesHandler;