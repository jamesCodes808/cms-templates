using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain.CMSTemplate;
using Sabio.Models.Requests.CMSTemplate;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class CMSTemplateService : ICMSTemplateService
    {
        IDataProvider _data = null;
        IAuthenticationService<int> _authservice = null;

        public CMSTemplateService(IDataProvider data, IAuthenticationService<int> authService)
        {
            _authservice = authService;
            _data = data;
        }

        public Paged<CMSTemplate> Select(int pageIndex, int pageSize)
        {
            Paged<CMSTemplate> pagedResult = null;
            List<CMSTemplate> result = null;
            int totalCount = 0;
            string procName = "[dbo].[CMSTemplate_SelectAllPaginated]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@pageIndex", pageIndex);
                    col.AddWithValue("@pageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    CMSTemplate cmsTemplate;
                    int index;
                    NewCmsTemplateMapper(reader, out cmsTemplate, out index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }

                    if (result == null)
                    {
                        result = new List<CMSTemplate>();
                    }

                    result.Add(cmsTemplate);

                });
            if (result != null)
            {
                pagedResult = new Paged<CMSTemplate>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }

        public Paged<CMSTemplate> SelectByCreatedBy(int pageIndex, int pageSize)
        {
            Paged<CMSTemplate> pagedResult = null;
            List<CMSTemplate> result = null;
            int totalCount = 0;
            string procName = "[dbo].[CMSTemplate_SelectByCreatedBy]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@CreatedBy", _authservice.GetCurrentUserId());
                    col.AddWithValue("@PageIndex", pageIndex);
                    col.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    CMSTemplate cmsTemplate;
                    int index;
                    NewCmsTemplateMapper(reader, out cmsTemplate, out index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }

                    if (result == null)
                    {
                        result = new List<CMSTemplate>();
                    }

                    result.Add(cmsTemplate);

                });
            if (result != null)
            {
                pagedResult = new Paged<CMSTemplate>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }

        public CMSTemplate SelectById(int id)
        {
            string procName = "[dbo].[CMSTemplate_SelectById]";
            CMSTemplate cmsTemplate = null;
            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    CMSTemplate cmsTemplate;
                    int index;
                    NewCmsTemplateMapper(reader, out cmsTemplate, out index);
                });
            return cmsTemplate;
        }

        public int Insert(CMSTemplateAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[CMSTemplate_Insert]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {

                    col.AddWithValue("@Name", model.Name);
                    col.AddWithValue("@Description", model.Description);
                    col.AddWithValue("@PrimaryImage", model.PrimaryImage);
                    col.AddWithValue("@CreatedBy", userId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;

                    Int32.TryParse(oId.ToString(), out id);
                });
            return id;
        }
        public void Update(CMSTemplateUpdateRequest model)
        {
            string procName = "[dbo].[CMSTemplate_Update]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Name", model.Name);
                    col.AddWithValue("@Description", model.Description);
                    col.AddWithValue("@PrimaryImage", model.PrimaryImage);
                    col.AddWithValue("@Id", model.Id);
                },
                returnParameters: null
                );
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[CMSTemplate_DeleteById]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                },
                returnParameters: null);
        }
        private static void NewCmsTemplateMapper(IDataReader reader, out CMSTemplate cmsTemplate, out int index)
        {
            cmsTemplate = new CMSTemplate();
            index = 0;
            cmsTemplate.Id = reader.GetSafeInt32(index++);
            cmsTemplate.Name = reader.GetSafeString(index++);
            cmsTemplate.Description = reader.GetSafeString(index++);
            cmsTemplate.PrimaryImage = reader.GetSafeString(index++);
            cmsTemplate.CreatedBy = reader.GetSafeInt32(index++);
            cmsTemplate.DateCreated = reader.GetSafeDateTime(index++);
            cmsTemplate.DateModified = reader.GetSafeDateTime(index++);
        }
    }
}
