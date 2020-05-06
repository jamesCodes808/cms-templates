using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.CMSTemplate;
using Sabio.Models.Requests.CMSTemplate;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/cms/templates")]
    [ApiController]
    public class CMSTemplatesApiController : BaseApiController
    {
        private ICMSTemplateService _cmsTemplateService = null;
        private IAuthenticationService<int> _authService = null;

        public CMSTemplatesApiController(ICMSTemplateService service,
            ILogger<CMSTemplatesApiController> logger,
            IAuthenticationService<int> authService
            ) : base(logger)
        {
            _cmsTemplateService = service;
            _authService = authService;
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<CMSTemplate>>> SelectAllPaginated(int pageIndex, int pageSize) 
        {
            int iCode = 201;
            BaseResponse response;

            try 
            {
                Paged<CMSTemplate> paged = _cmsTemplateService.Select(pageIndex, pageSize);
                if (paged == null) 
                {
                    iCode = 404;
                    response = new ErrorResponse("CMSTemplates not found");
                }
                else 
                {
                    response = new ItemResponse<Paged<CMSTemplate>>() { Item = paged };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ ex.Message }");
            }
            return StatusCode(iCode, response);

        }

        [HttpGet("current")]
        public ActionResult<ItemResponse<Paged<CMSTemplate>>> SelectByCreatedBy(int pageIndex, int pageSize) 
        {
            int iCode = 201;
            BaseResponse response;

            try
            {
                Paged<CMSTemplate> paged = _cmsTemplateService.SelectByCreatedBy(pageIndex, pageSize);


                if (paged == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("CMSTemplates not found");
                }
                else
                {
                    response = new ItemResponse<Paged<CMSTemplate>>() { Item = paged };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ ex.Message }");
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<CMSTemplate>> SelectById(int id) 
        {
            int iCode = 201;
            BaseResponse response;

            try
            {
                CMSTemplate cmsTemplate = _cmsTemplateService.SelectById(id);
                response = new ItemResponse<CMSTemplate>();

                if (cmsTemplate == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("CMSTemplate not found");
                }
                else
                {
                    response = new ItemResponse<CMSTemplate> { Item = cmsTemplate };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ ex.Message }   ");
            }
            return StatusCode(iCode, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Insert(CMSTemplateAddRequest model) 
        {
            int iCode = 201;
            BaseResponse response;

            try 
            {
                int userId = _authService.GetCurrentUserId();
                int id = _cmsTemplateService.Insert(model, userId);
                response = new ItemResponse<int> { Item = id };
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ ex.Message }");
            }
            return StatusCode(iCode, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(CMSTemplateUpdateRequest model) 
        {
            int iCode = 201;
            BaseResponse response;

            try 
            {
                _cmsTemplateService.Update(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ ex.Message }   ");
            }
            return StatusCode(iCode, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int iCode = 200;
            BaseResponse response;

            try
            {
                _cmsTemplateService.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ ex.Message }   ");
            }
            return StatusCode(iCode, response);
        }
    }
}